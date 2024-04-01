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
// 				displayName: 'Method',
// 				name: 'myMethod',
// 				type: 'options',
// 				noDataExpression: true,
// 				options: [
// 					{
// 						name: 'GET',
// 						value: 'get',
// 						action: 'Perform a GET request',
// 						routing: {
// 							request: {
// 								method: 'GET',
// 								url: '/get',
// 							},
// 						},
// 					},
// 					{
// 						name: 'DELETE',
// 						value: 'delete',
// 						action: 'Perform a DELETE request',
// 						routing: {
// 							request: {
// 								method: 'DELETE',
// 								url: '/delete',
// 							},
// 						},
// 					},

// 					{
// 						name: 'POST',
// 						value: 'post',
// 						action: 'Perform a DELETE request',
// 						routing: {
// 							request: {
// 								method: 'DELETE',
// 								url: '/delete',
// 							},
// 						},
// 					},
// 				],
// 				default: 'GET',
// 			},
// 			{
// 				displayName: 'URL',
// 				name: 'mystring',
// 				type: 'string',
// 				default: '',

// 				description: 'The description text',
// 			},
// 		],
// 	};

//  {++++++++++++++++++++++++++++++++++++++++++++++}

// 	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 		// fs.readFile('../custom-node-config.json', 'utf8', function(data){
// 		//  // Display the file content
// 		//  console.log(data);
// 		// });
// 		const items = this.getInputData();
// 		const returnData: INodeExecutionData[][] = [];

// 		for (const item of items) {
// 			try {
// 				// Read the file asynchronously
// 				const res = await fs.promises.readFile(
// 					path.join(__dirname, '../../../custom.json'),
// 					'utf8',
// 				);
// 				const data = JSON.parse(res);

// 				returnData.push([{ json: data }]);

// 				// Log the return data
// 				console.log(returnData);

// 				// Create a return item with test data
// 				const returnItem: INodeExecutionData = {
// 					json: {
// 						data: 'test',
// 					},
// 				};

// 				returnData.push([returnItem]);
// 			} catch (error) {
// 				if (this.continueOnFail()) {
// 					// Handle errors if continuing on fail is enabled
// 					throw new NodeOperationError(this.getNode(), error.message, {
// 						itemIndex: item.index,
// 					});
// 				} else {
// 					// Throw a NodeOperationError if continuing on fail is not enabled
// 					throw new NodeOperationError(this.getNode(), error.message);
// 				}
// 			}
// 		}
// 		// console.log(returnData);

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
