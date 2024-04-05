import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import Redis from 'ioredis';

export class CustomNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Custom Node',
		name: 'custom Node',
		group: ['transform'],
		version: 1,
		description: 'Basic Custom Node',
		defaults: {
			name: 'Custom Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'My String',
				name: 'myString',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const redis = new Redis({
			host: process.env.HOST as string,
			port: parseInt(process.env.PORT as string),
		});

		try {
			// Use await with Redis commands

			const returnData: INodeExecutionData[][] = [];

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				try {
					// Retrieve the 'myString' property from the input parameters
					const myString = this.getNodeParameter('myString', itemIndex) as string;
					var request: any = await redis.call('JSON.GET', myString);

					// Construct the return item
					const returnItem: INodeExecutionData = {
						json: {
							request,
						},
					};

					returnData.push([returnItem]);
				} catch (error) {
					// Handle errors
					if (this.continueOnFail()) {
						items.push({
							json: this.getInputData(itemIndex)[0].json,
							error,
							pairedItem: itemIndex,
						});
					} else {
						if (error.context) {
							error.context.itemIndex = itemIndex;
							throw error;
						}
						throw new NodeOperationError(this.getNode(), error, {
							itemIndex,
						});
					}
				}
			}

			return returnData;
		} finally {
			await redis.quit();
		}
	}
}
