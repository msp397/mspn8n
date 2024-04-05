import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
const Redis = require('ioredis');
// var redis = new Redis({
// 	host: process.env.HOST,
// 	port: process.env.PORT,
// });
// import * as fs from 'fs';
// import * as path from 'path';

// const filePath = path.join(__dirname, '../../../custom.json');
// const fileContent = fs.readFileSync(filePath, 'utf8');
// const jsonData = JSON.parse(fileContent);
// console.log(jsonData);

export class WriteTorusPlatformData implements INodeType {
	description: INodeTypeDescription;
	constructor() {
		// Dynamically set display names for properties based on JSON data
		// const myStringDefaultValue = jsonData.data.method;
		// const mySecondStringDefaultValue = jsonData.data.url;

		// Update default values dynamically

		// Define the node description
		this.description = {
			displayName: 'Write Torus Platform Data',
			name: 'writeTorusPlatformData',
			group: ['transform'],
			version: 1,
			description: 'Basic Example Node',
			defaults: {
				name: 'Write Torus Platform Data',
			},
			inputs: ['main'],
			outputs: ['main'],
			properties: [
				{
					displayName: 'Redis_Data',
					name: 'redisData',
					type: 'options',
					options: [
						{
							name: 'JSON',
							value: 'json',
						},
						{
							name: 'STREAM',
							value: 'stream',
						},
					],
					default: 'json',
					placeholder: 'Placeholder value',
					description: 'The description text',
				},
				{
					displayName: 'Torus_Key',
					name: 'torusKey',
					type: 'string',
					default: '',
					placeholder: 'Placeholder value',
					description: 'The description text',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					placeholder: 'Placeholder value',
					description: 'The description text',
				},
			],
		};

		// this.description.properties[0].default = myStringDefaultValue;
		// this.description.properties[1].default = mySecondStringDefaultValue;
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const redisData = this.getNodeParameter('redisData', i) as string;
			const torusKey = this.getNodeParameter('torusKey', i) as string;
			const value: any = this.getNodeParameter('value', i) as string;

			const redis = new Redis({
				host: process.env.HOST,
				port: process.env.PORT,
			});

			try {
				// Connect to Redis server
				// await redis.connect();

				// Set the key-value pair in Redis
				if (redisData === 'json') {
					await redis.call('JSON.SET', torusKey, '$', JSON.stringify(value));
				} else if (redisData === 'stream') {
					// Assuming 'value' is an array of objects for the stream
					for (const item of value) {
						await redis.call('xadd', torusKey, '*', 'value', JSON.stringify(item));
					}
				}

				// Add the result to the return data
				returnData.push({
					json: {
						torusKey,
						value,
					},
				});
			} catch (error) {
				console.error('Redis Error:', error.message);
				throw new NodeOperationError(this.getNode(), 'Redis Error: ' + error.message);
			}
		}

		return [returnData];
	}
}
