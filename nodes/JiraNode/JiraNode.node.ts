import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import axios from 'axios';
const Redis = require('ioredis');

export class JiraNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jira Create Issue',
		name: 'jiraCreateIssue',
		group: ['output'],
		version: 1,
		description: 'Creates an issue in Jira',
		defaults: {
			name: 'Jira Create Issue',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Create',
						value: 'create',
					},
					{
						name: 'Update',
						value: 'update',
					},
					{
						name: 'Delete',
						value: 'delete',
					},
				],
				default: 'create',
				description: 'The operation to perform',
			},
			{
				displayName: 'key',
				name: 'key',
				type: 'string',
				default: '',
				description: 'The ID of the issue to update or delete',
				displayOptions: {
					show: {
						resource: ['update', 'delete'],
					},
				},
			},
			{
				displayName: 'Issue Type',
				name: 'issueType',
				type: 'options',
				options: [
					{
						name: 'Task',
						value: 'Task',
					},
					{
						name: 'Bug',
						value: 'Bug',
					},
					{
						name: 'Story',
						value: 'Story',
					},
				],
				default: 'Task',
				description: 'The type of issue',
				displayOptions: {
					show: {
						resource: ['create'],
					},
				},
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
				description: 'The summary of the issue',
				displayOptions: {
					show: {
						resource: ['create', 'update'],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the issue',
				displayOptions: {
					show: {
						resource: ['create', 'update'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const resource = this.getNodeParameter('resource', itemIndex) as string;

			// Jira authentication
			const auth = {
				username: 'raml@torus.tech',
				password:
					'ATATT3xFfGF0Chb3Hb4jroBZK5HtdaQZeW3nCdZ4KW-U77r_q1e69SXGdCwCnJT5l2EU98J3pJC5yzUbRhoDpwxFfqUlpMdVXGRhl3FVa9c9rJyAzOjUaxs2wLrAo8Yd6p7sJAD8pEaWV_QjLaj6vNgnPP0vr40xxGxEWm-xKCItgPYSlQr4PKM=000462AB', // Replace with your actual API token
			};

			const redis = new Redis({
				host: process.env.HOST, // Replace with your Redis host
				port: process.env.PORT, // Replace with your Redis port
			});

			const data = JSON.parse(await redis.call('JSON.GET', 'GSS-DEV:Payments:Torus:requirements'));
			const index = data[data.length - 1];
			const recordData = index.recordType;
			const summaryData = index.Summary;
			const issueTypeData = index.Issue_type;
			const descrptionData = index.Description;

			let response;
			try {
				if (recordData === 'A') {
					if (resource === 'create') {
						const summary = this.getNodeParameter('summary', itemIndex) as string;
						const description = this.getNodeParameter('description', itemIndex) as string;
						const issueType = this.getNodeParameter(
							'issueType',
							itemIndex,
							issueTypeData,
						) as string;

						if (!summary) {
							throw new NodeOperationError(this.getNode(), 'Summary is not provided.');
						}

						const postData = {
							fields: {
								project: {
									key: 'SCRUM',
								},
								summary: summaryData,
								description: descrptionData,
								issuetype: issueTypeData,
							},
						};
						console.log(postData);
						try {
							response = await axios.post(
								'https://torus-jiracloud.atlassian.net/rest/api/2/issue',
								postData,
								{ auth },
							);
							console.log(response);
						} catch (error) {
							console.log(error);
						}
					}
				}
				if (recordData === 'U') {
					if (resource === 'update') {
						const key = this.getNodeParameter('key', itemIndex) as string;
						const summary = this.getNodeParameter('summary', itemIndex) as string;
						const description = this.getNodeParameter(
							'description',
							itemIndex,
							descrptionData,
						) as string;

						if (!key) {
							throw new NodeOperationError(this.getNode(), 'Issue ID is not provided.');
						}

						const updateData = {
							fields: {
								summary: summary,
								description: description,
							},
						};

						response = await axios.put(
							`https://torus-jiracloud.atlassian.net/rest/api/2/issue/${key}`,
							updateData,
							{ auth },
						);
					}
				} else if (recordData === 'D') {
					if (resource === 'delete') {
						const key = this.getNodeParameter('key', itemIndex) as string;

						if (!key) {
							throw new NodeOperationError(this.getNode(), 'Issue ID is not provided.');
						}

						response = await axios.delete(
							`https://torus-jiracloud.atlassian.net/rest/api/2/issue/${key}`,
							{ auth },
						);
					}
				}
				const success = true;
				returnData.push({ json: { success: success } });
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Failed to ${resource} issue: ${error.message}`,
				);
			}
		}

		return [returnData];
	}
}
