// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 		const filePath = path.join(__dirname, '../../../custom.json');
// 		const fileContent = fs.readFileSync(filePath, 'utf8');
// 		const jsonData = JSON.parse(fileContent);
// 		console.log(jsonData);

// 		const myStringDefaultValue = jsonData.data.method;
// 		const mySecondStringDefaultValue = jsonData.data.url;

// 		// Update default values dynamically
// 		this.description.properties[0].default = myStringDefaultValue;
// 		this.description.properties[1].default = mySecondStringDefaultValue;

// 		const items = this.getInputData();

// 		const returnData: INodeExecutionData[][] = [];

// 		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
// 			try {
// 				const myString = this.getNodeParameter(
// 					'myString',
// 					itemIndex,
// 					myStringDefaultValue,
// 				) as string;
// 				const mySecondString = this.getNodeParameter(
// 					'mySecondString',
// 					itemIndex,
// 					mySecondStringDefaultValue,
// 				) as string;

// 				const returnItem: INodeExecutionData = {
// 					json: {
// 						myString,
// 						mySecondString,
// 					},
// 				};

// 				returnData.push([returnItem]);
// 			} catch (error) {
// 				if (this.continueOnFail()) {
// 					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
// 				} else {
// 					if (error.context) {
// 						error.context.itemIndex = itemIndex;
// 						throw error;
// 					}
// 					throw new NodeOperationError(this.getNode(), error, {
// 						itemIndex,
// 					});
// 				}
// 			}
// 		}

// 		return this.prepareOutputData(returnData.flat());
// 	}
// }

//  {++++++++++++++++++++++++++++++++++++++++++++++}

// export class ExampleNode implements INodeType {
// 	description: INodeTypeDescription = {
// 		displayName: 'Example Node',
// 		name: 'exampleNode',
// 		group: ['transform'],
// 		version: 1,
// 		description: 'Basic Example Node',
// 		defaults: {
// 			name: 'Example Node',
// 		},
// 		inputs: ['main'],
// 		outputs: ['main'],

// 		properties: [
// 			// Node properties which the user gets displayed and
// 			// can change on the node.

// 			{
// 				displayName: 'My String',
// 				name: 'myString',
// 				type: 'string',
// 				default: '',
// 				placeholder: 'Placeholder value',
// 				description: 'The description text',
// 			},
// 			{
// 				displayName: 'My Second String',
// 				name: 'mySecondString',
// 				type: 'string',
// 				default: '',
// 				placeholder: 'Placeholder value',
// 				description: 'The description text',
// 			},
// 		],
// 	};

// The function below is responsible for actually doing whatever this node
// is supposed to do. In this case, we're just appending the `myString` property
// with whatever the user has entered.
// You can make async calls and use `await`.
// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 		const items = this.getInputData();

// 		const returnData: INodeExecutionData[][] = [];
// 		let returnItem: INodeExecutionData;
// 		const filePath = path.join(__dirname, '../../../custom.json');
// 		const fileContent = fs.readFileSync(filePath, 'utf8');
// 		const jsonData = JSON.parse(fileContent);
// 		console.log(jsonData);

// 		// let item: INodeExecutionData;

// 		let myString = jsonData.data.method;
// 		let mySecondString = jsonData.data.url;

// 		// Iterates over all input items and add the key "myString" with the
// 		// value the parameter "myString" resolves to.
// 		// (This could be a different value for each item in case it contains an expression)
// 		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
// 			try {
// 				myString = this.getNodeParameter('myString', itemIndex, myString) as string;
// 				mySecondString = this.getNodeParameter(
// 					'mySecondString',
// 					itemIndex,
// 					mySecondString,
// 				) as string;

// 				// console.log(myString, mySecondString);

// 				// item = items[itemIndex];
// 				returnItem = {
// 					json: {
// 						myString,
// 						mySecondString,
// 					},
// 				};

// 				returnData.push([returnItem]);
// 			} catch (error) {
// 				// This node should never fail but we want to showcase how
// 				// to handle errors.
// 				if (this.continueOnFail()) {
// 					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
// 				} else {
// 					// Adding `itemIndex` allows other workflows to handle this error
// 					if (error.context) {
// 						// If the error thrown already contains the context property,
// 						// only append the itemIndex
// 						error.context.itemIndex = itemIndex;
// 						throw error;
// 					}
// 					throw new NodeOperationError(this.getNode(), error, {
// 						itemIndex,
// 					});
// 				}
// 			}
// 		}
// 		// console.log(returnData);

// 		return this.prepareOutputData(returnData.flat());
// 	}
// }

//  {++++++++++++++++++++++++++++++++++++++++++++++}

// function generateDisplayName(propertyName: string): string {
// 	// Logic to generate dynamic display name
// 	// For example, you can concatenate the property name with a value from jsonData
// 	return `${propertyName} - ${jsonData.data[propertyName]}`;
// }

// export class ExampleNode implements INodeType {
// 	description: INodeTypeDescription;

// 	constructor() {
// 		// Dynamically set display names for properties based on JSON data
// 		const myStringDisplayName = jsonData.data.DisplayName1;
// 		const mySecondStringDisplayName = jsonData.data.DisplayName2;

// 		// Define the node description
// 		this.description = {
// 			displayName: 'Example Node',
// 			name: 'exampleNode',
// 			group: ['transform'],
// 			version: 1,
// 			description: 'Basic Example Node',
// 			defaults: {
// 				name: 'Example Node',
// 			},
// 			inputs: ['main'],
// 			outputs: ['main'],
// 			properties: [
// 				{
// 					displayName: myStringDisplayName,
// 					name: 'myString',
// 					type: 'string',
// 					default: '',
// 					placeholder: 'Placeholder value',
// 					description: 'The description text',
// 				},
// 				{
// 					displayName: mySecondStringDisplayName,
// 					name: 'mySecondString',
// 					type: 'string',
// 					default: '',
// 					placeholder: 'Placeholder value',
// 					description: 'The description text',
// 				},
// 			],
// 		};
// 	}

//  {++++++++++++++++++++++++++++++++++++++++++++++}

// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 		const items = this.getInputData();

// 		const returnData: INodeExecutionData[][] = [];
// 		let returnItem: INodeExecutionData;

// 		// let item: INodeExecutionData;

// 		let myString: string;
// 		let mySecondString: string;

// 		// Iterates over all input items and add the key "myString" with the
// 		// value the parameter "myString" resolves to.
// 		// (This could be a different value for each item in case it contains an expression)
// 		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
// 			try {
// 				myString = this.getNodeParameter('myString', itemIndex, '') as string;
// 				mySecondString = this.getNodeParameter('mySecondString', itemIndex, '') as string;

// 				// console.log(myString, mySecondString);

// 				// item = items[itemIndex];
// 				returnItem = {
// 					json: {
// 						myString,
// 						mySecondString,
// 					},
// 				};

// 				returnData.push([returnItem]);
// 			} catch (error) {
// 				// This node should never fail but we want to showcase how
// 				// to handle errors.
// 				if (this.continueOnFail()) {
// 					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
// 				} else {
// 					// Adding `itemIndex` allows other workflows to handle this error
// 					if (error.context) {
// 						// If the error thrown already contains the context property,
// 						// only append the itemIndex
// 						error.context.itemIndex = itemIndex;
// 						throw error;
// 					}
// 					throw new NodeOperationError(this.getNode(), error, {
// 						itemIndex,
// 					});
// 				}
// 			}
// 		}
// 		// console.log(returnData);

// 		return this.prepareOutputData(returnData.flat());
// 	}
// }

//  {++++++++++++++++++++++++++++++++++++++++++++++}

// import {
// 	IExecuteFunctions,
// 	INodeExecutionData,
// 	INodeType,
// 	INodeTypeDescription,
// 	NodeOperationError,
// } from 'n8n-workflow';
// import * as fs from 'fs';
// import * as path from 'path';

// const filePath = path.join(__dirname, '../../../custom.json');
// const fileContent = fs.readFileSync(filePath, 'utf8');
// const jsonData = JSON.parse(fileContent);
// console.log(jsonData);

// export class ExampleNode implements INodeType {
// 	description: INodeTypeDescription;
// 	constructor() {
// 		// Dynamically set display names for properties based on JSON data
// 		const myStringDefaultValue = jsonData.data.method;
// 		const mySecondStringDefaultValue = jsonData.data.url;

// 		// Update default values dynamically

// 		// Define the node description
// 		this.description = {
// 			displayName: 'Example Node',
// 			name: 'exampleNode',
// 			group: ['transform'],
// 			version: 1,
// 			description: 'Basic Example Node',
// 			defaults: {
// 				name: 'Example Node',
// 			},
// 			inputs: ['main'],
// 			outputs: ['main'],
// 			properties: [
// 				{
// 					displayName: 'My String',
// 					name: 'myString',
// 					type: 'string',
// 					default: '',
// 					placeholder: 'Placeholder value',
// 					description: 'The description text',
// 				},
// 				{
// 					displayName: 'My Second String',
// 					name: 'mySecondString',
// 					type: 'string',
// 					default: '',
// 					placeholder: 'Placeholder value',
// 					description: 'The description text',
// 				},
// 			],
// 		};
// 		this.description.properties[0].default = myStringDefaultValue;
// 		this.description.properties[1].default = mySecondStringDefaultValue;
// 	}

// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 		const items = this.getInputData();

// 		const returnData: INodeExecutionData[][] = [];
// 		let returnItem: INodeExecutionData;

// 		// let item: INodeExecutionData;

// 		let myString: string;
// 		let mySecondString: string;

// 		// Iterates over all input items and add the key "myString" with the
// 		// value the parameter "myString" resolves to.
// 		// (This could be a different value for each item in case it contains an expression)
// 		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
// 			try {
// 				myString = this.getNodeParameter('myString', itemIndex, '') as string;
// 				mySecondString = this.getNodeParameter('mySecondString', itemIndex, '') as string;

// 				// console.log(myString, mySecondString);

// 				// item = items[itemIndex];
// 				returnItem = {
// 					json: {
// 						myString,
// 						mySecondString,
// 					},
// 				};

// 				returnData.push([returnItem]);
// 			} catch (error) {
// 				// This node should never fail but we want to showcase how
// 				// to handle errors.
// 				if (this.continueOnFail()) {
// 					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
// 				} else {
// 					// Adding `itemIndex` allows other workflows to handle this error
// 					if (error.context) {
// 						// If the error thrown already contains the context property,
// 						// only append the itemIndex
// 						error.context.itemIndex = itemIndex;
// 						throw error;
// 					}
// 					throw new NodeOperationError(this.getNode(), error, {
// 						itemIndex,
// 					});
// 				}
// 			}
// 		}
// 		// console.log(returnData);

// 		return this.prepareOutputData(returnData.flat());
// 	}
// }
