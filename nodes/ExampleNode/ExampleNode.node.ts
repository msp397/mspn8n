import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../../../custom.json');
const fileContent = fs.readFileSync(filePath, 'utf8');
const jsonData = JSON.parse(fileContent);
console.log(jsonData);

export class ExampleNode implements INodeType {
	description: INodeTypeDescription;
	constructor() {
		// Dynamically set display names for properties based on JSON data
		const myStringDefaultValue = jsonData.data.method;
		const mySecondStringDefaultValue = jsonData.data.url;

		// Update default values dynamically

		// Define the node description
		this.description = {
			displayName: 'Example Node',
			name: 'exampleNode',
			group: ['transform'],
			version: 1,
			description: 'Basic Example Node',
			defaults: {
				name: 'Example Node',
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
				{
					displayName: 'My Second String',
					name: 'mySecondString',
					type: 'string',
					default: '',
					placeholder: 'Placeholder value',
					description: 'The description text',
				},
			],
		};
		this.description.properties[0].default = myStringDefaultValue;
		this.description.properties[1].default = mySecondStringDefaultValue;
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[][] = [];
		let returnItem: INodeExecutionData;

		// let item: INodeExecutionData;

		let myString: string;
		let mySecondString: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myString = this.getNodeParameter('myString', itemIndex, '') as string;
				mySecondString = this.getNodeParameter('mySecondString', itemIndex, '') as string;

				// console.log(myString, mySecondString);

				// item = items[itemIndex];
				returnItem = {
					json: {
						myString,
						mySecondString,
					},
				};

				returnData.push([returnItem]);
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}
		// console.log(returnData);

		return this.prepareOutputData(returnData.flat());
	}
}
