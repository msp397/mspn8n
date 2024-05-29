import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow'; // Import the INodeType interface

const Redis = require('ioredis'); // Import the Redis module

export class TorusPlatformData implements INodeType {
	// Export the TorusPlatformData class
	description: INodeTypeDescription;
	/**
	 * Constructor for the TorusPlatformData class.
	 * Initializes the description property with the node type description.
	 * The description includes display name, name, icon, group, version, description, inputs, outputs, and properties.
	 * The properties include tenant, operation, redisData, redisDataType, fromKeyName, groupName, consumer, keyName, streamName, toKeyName, path, value, and Value.
	 * Each property has a displayName, name, type, default value, description, and displayOptions.
	 */
	constructor() {
		// Constructor
		this.description = {
			// Description of the node
			displayName: 'Torus Platform Data', // Display name for the node
			name: 'torusPlatformData', // Name of the node
			icon: 'file:logo_original.png', // Icon for the node
			group: ['transform'], // Group this node belongs to
			version: 1, // Version of this node
			description: 'Node for reading or writing data to Torus platform', // Description of this node
			defaults: {
				name: 'Torus Platform Data', // Display name for the node
			},
			inputs: ['main'], // Input connectors
			outputs: ['main'], // Output connectors
			properties: [
				{
					displayName: 'Tenant', // Display name for the property
					name: 'tenant', // Name of the property
					type: 'string', // Type of the property
					default: '', // Default value for the property
					description: 'Enter your Torus Platform Tenant ID', // Description of the property
					required: true, // Required property
					displayOptions: {
						// Display options for the property
						show: {
							// Show the property only when the operation is 'write' or 'read'
							operation: ['write', 'read'],
							redisData: ['json'],
						},
					},
				},
				{
					displayName: 'Operation', // Display name for the property
					name: 'operation', // Name of the property
					type: 'options',
					noDataExpression: true, // Type of the property
					options: [
						// Options for the property
						{
							name: 'WRITE',
							value: 'write',
						},
						{
							name: 'READ',
							value: 'read',
						},
						{
							name: 'BOTH',
							value: 'both',
						},
					],
					default: 'write',
					description: 'Select whether to write or read data from Torus',
				},
				{
					displayName: 'Redis Data', // Display name for the property
					name: 'redisData', // Name of the property
					type: 'options', // Type of the property
					options: [
						// Options for the property
						{
							name: 'JSON',
							value: 'json',
						},
						{
							name: 'STREAM',
							value: 'stream',
						},
					],
					default: 'json', // Default value for the property
					description: 'Choose the type of data structure in Redis', // Description of the property
					displayOptions: {
						// Display options for the property
						show: {
							// Show the property only when the operation is 'write' or 'read'
							operation: ['write', 'read'], // Show the property only when the operation is 'write' or 'read'
						},
					},
				},
				{
					displayName: 'Redis DataType', // Display name for the property
					name: 'redisDataType', // Name of the property
					type: 'options', // Type of the property
					options: [
						//  Options for the property
						{
							name: 'JSON - JSON',
							value: 'json-json',
						},
						{
							name: 'STREAM - STREAM',
							value: 'stream-stream',
						},
						{
							name: 'JSON - STREAM',
							value: 'json-stream',
						},
						{
							name: 'STREAM - JSON',
							value: 'stream-json',
						},
					],
					default: 'json-json', // Default value for the property
					description: 'Choose the type of data structure in Redis', // Description of the property
					displayOptions: {
						// Display options for the property
						show: {
							operation: ['both'],
						},
					},
				},
				{
					displayName: 'From KeyName', // Display name for the property
					name: 'fromKeyName', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter key name', // Placeholder for the property
					description: 'Specify the key for storing or retrieving data in Torus', // Description of the property
					displayOptions: {
						// Display options for the property
						show: {
							operation: ['both'],
							redisDataType: ['stream-stream', 'json-json', 'json-stream', 'stream-json'],
						},
					},
				},
				{
					displayName: 'Group Name', // Display name for the property
					name: 'groupName', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter consumer name',
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						show: {
							operation: ['both'],
							redisDataType: ['stream-json', 'json-stream'],
						},
					},
				},
				{
					displayName: 'Consumer', // Display name for the property
					name: 'consumer', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter consumer name', // Placeholder for the property
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						// Display options for the property
						show: {
							operation: ['both'],
							redisDataType: ['stream-json', 'json-stream'],
						},
					},
				},
				{
					displayName: 'Key Name', // Display name for the property
					name: 'keyName', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter key name', // Placeholder for the property
					description: 'Specify the key for storing or retrieving data in Torus', // Description of the property
					displayOptions: {
						// Display options for the property
						show: {
							// Show the property only when the operation is 'write' or 'read'
							operation: ['read', 'write'],
							redisData: ['json'],
						},
					},
				},
				{
					displayName: 'Stream Name', // Display name for the property
					name: 'streamName', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter key name', // Placeholder for the property
					description: 'Specify the key for storing or retrieving data in Torus', // Description of the property
					displayOptions: {
						// Display options for the property
						show: {
							operation: ['read', 'write'],
							redisData: ['stream'],
						},
					},
				},
				// {
				//  displayName: 'Stream ID', // Display name for the property
				//  name: 'streamId', // Name of the property
				//  type: 'string', //  Type of the property
				//  default: '', // Default value for the property
				//  placeholder: 'Enter id', // Placeholder for the property
				//  description: 'Specify the key for storing or retrieving data in Torus', // Description of the property
				//  displayOptions: {
				//      // Display options for the property
				//      show: {
				//          operation: ['read'],
				//          redisData: ['stream'],
				//      },
				//  },
				// },

				{
					displayName: 'To KeyName', // Display name for the property
					name: 'toKeyName', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter key name', // Placeholder for the property
					description: 'Specify the key for storing or retrieving data in Torus', // Description of the property
					displayOptions: {
						// Display options for the property
						show: {
							operation: ['both'],
							redisDataType: ['stream-stream', 'json-json', 'json-stream', 'stream-json'],
						},
					},
				},
				{
					displayName: 'Path', // Display name for the property
					name: 'path', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter path', // Placeholder for the property
					description: 'Specify the value to be stored in Torus (for write operation)', // Description of the property
					displayOptions: {
						// Display options for the property
						show: {
							operation: ['both'],
							redisDataType: ['json-json', 'stream-stream'],
						},
					},
				},

				{
					displayName: 'Value', // Display name for the property
					name: 'value', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter value', // Placeholder for the property
					description: 'Specify the value to be stored in Torus (for write operation)', // Description of the property
					displayOptions: {
						//  Display options for the property
						show: {
							operation: ['write'],
						},
					},
				},
				{
					displayName: 'Value', // Display name for the property
					name: 'Value', // Name of the property
					type: 'string', //  Type of the property
					default: '', // Default value for the property
					placeholder: 'Enter Value', // Placeholder for the property
					description: 'Specify the Value to be stored in Torus (for write operation)', // Description of the property
					displayOptions: {
						//  Display options for the property
						show: {
							operation: ['both'], // Show the property only when the operation is 'write' or 'read'
							redisDataType: ['stream-stream', 'json-json'],
						},
					},
				},
			],
		};
	}

	/**
	 * Executes the function based on the provided operation.
	 *
	 * @return {Promise<INodeExecutionData[][]>} A promise that resolves to an array of arrays of node execution data.
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			// eslint-disable-line
			const operation = this.getNodeParameter('operation', i) as string; // Retrieving parameters based on the operation

			let redisData = '';
			let keyName = '';
			let streamName = '';
			let value = '';
			let fromKeyName = '';
			let toKeyName = '';
			let path = '';
			let Value = '';
			let consumer = '';
			let groupName = '';
			let redisDataType = '';
			let tenant = '';
			// let streamId = '';

			// Retrieving parameters based on the operation
			if (operation === 'write' || operation === 'read') {
				// Retrieving parameters based on the operation
				redisData = this.getNodeParameter('redisData', i) as string; // Retrieving parameters based on the operation

				if (redisData === 'json') {
					// Retrieving parameters based on the operation
					keyName = this.getNodeParameter('keyName', i) as string; // Retrieving parameters based on the operation
					tenant = this.getNodeParameter('tenant', i) as string; // Retrieving parameters based on the operation
				} else if (redisData === 'stream') {
					// Retrieving parameters based on the operation
					streamName = this.getNodeParameter('streamName', i) as string; // Retrieving parameters based on the operation
					// streamId = this.getNodeParameter('streamId', i) as string; // Retrieving parameters based on the operation
				}
			}
			if (operation === 'write') {
				// Retrieving parameters based on the operation
				// for 'write' operation
				value = this.getNodeParameter('value', i) as string; // Retrieving parameters based on the operation
			}
			if (operation === 'both') {
				// Retrieving additional parameters for 'both' operation
				redisDataType = this.getNodeParameter('redisDataType', i) as string; // Retrieving parameters based on the operation
				if (redisDataType === 'json-json' || redisDataType === 'stream-stream') {
					// Retrieving parameters based on the operation
					Value = this.getNodeParameter('Value', i) as string; // Retrieving parameters based on the operation
					path = this.getNodeParameter('path', i) as string; // Retrieving parameters based on the operation
				}
				if (redisDataType === 'stream-json') {
					// Retrieving parameters based on the operation
					// Additional parameters specific to 'stream-json'
				}
				fromKeyName = this.getNodeParameter('fromKeyName', i) as string; // Retrieving parameters based on the operation
				toKeyName = this.getNodeParameter('toKeyName', i) as string; // Retrieving parameters based on the operation
				consumer = this.getNodeParameter('consumer', i) as string; // Retrieving parameters based on the operation
				groupName = this.getNodeParameter('groupName', i) as string; // Retrieving parameters based on the operation
			}

			const redis = new Redis({
				// Initialize Redis connection
				host: process.env.HOST, // Replace with your Redis host
				port: process.env.PORT, // Replace with your Redis port
			});

			try {
				// Perform operations based on the parameters
				if (operation === 'write') {
					// let fullKeyName: any;
					// let itemsJson: any;
					// Writing data to Redis
					if (redisData === 'json') {
						// Writing data to Redis
						// Writing data to Redis
						if (Object.keys(items[0].json).length == 0) {
							await redis.call('JSON.SET', keyName + ':' + tenant, '$', JSON.stringify(value)); // Set the key-value pair in Redis
							// Set the key-value pair in Redis
							console.log(items);
							// console.log(fullKeyName);
							// fullKeyName = `${keyName}:${tenant}`;
							// itemsJson = JSON.stringify(value);
						} else {
							await redis.call(
								'JSON.ARRAPPEND',
								keyName + ':' + tenant,
								'$',
								JSON.stringify(items),
							);
						}
						returnData.push({
							// Write to json
							json: {
								tenant,
								operation: 'write',
								keyName,
							},
						});
					} else if (redisData === 'stream') {
						// Writing data to Redis
						//console.log(Object.keys(items[0].json).length);
						// if (Object.keys(items[0].json).length == 0) {
						await redis.call('xadd', streamName, '*', 'value', JSON.stringify(value));
						// } else {
						//  await redis.call('xadd', streamName, '*', 'value', JSON.stringify(items));
						// }

						returnData.push({
							// Write to stream
							json: {
								operation: 'write',
								streamName,
								value,
							},
						});
					}
				}

				if (operation === 'read') {
					// Reading data from Redis
					let data: any; // Initialize data variable
					let index: any;
					let dataLength: any;
					// let dataLength: any;
					if (redisData === 'json') {
						// Read from json
						data = JSON.parse(await redis.call('JSON.GET', keyName + ':' + tenant)); // Retrieve data from Redis
						dataLength = data.length - 1;

						// console.log(dataLength);

						index = data[dataLength];

						// console.log(index);

						if (data === null) {
							// Check if data is null
							throw new Error(`Key ${keyName} not found in Redis.`);
						}
						returnData.push({
							// Read from json
							json: {
								tenant,
								operation: 'read',
								keyName,
								index,
							},
						});
					} else if (redisData === 'stream') {
						// console.log(streamId);
						console.log(streamName);
						// Read from stream
						// data = await redis.call('xrange', streamName, '-', '+');
						// data = await redis.call('xrange', streamName, streamId, streamId);
						// dataLength = await redis.call('xlen', streamName);
						data = await redis.call('xrevrange', streamName, '+', '-', 'COUNT', 1);
						// data = await redis.xread('COUNT', dataLength, 'STREAMS', streamName, '$');
						console.log(data);
						// console.log(dataLength);

						if (data === null) {
							throw new Error(`Key ${keyName} not found in Redis.`);
						}
						returnData.push({
							json: {
								operation: 'read',
								streamName,
								data,
							},
						});
					}
				}

				if (operation === 'both') {
					// Performing both read and write operations
					let list: any; // Initialize list variable
					if (redisDataType === 'json-json') {
						// Read from JSON and write to JSON
						if (fromKeyName) {
							// Check if fromKeyName exists
							list = await redis.call('JSON.GET', fromKeyName); // Retrieve data from Redis

							let info = JSON.parse(list); // Parse list to JSON
							console.log(info); // Log info

							returnData.push({
								// Write to JSON
								json: {
									operation: 'both',
									fromKeyName,
									info,
								},
							});
						}
						if (toKeyName && path) {
							// Write to JSON
							await redis.call('JSON.ARRAPPEND', toKeyName, '.' + path, Value);
							returnData.push({
								json: {
									operation: 'both',
									toKeyName,
									Value,
								},
							});
						} else {
							if (toKeyName) {
								// Write to JSON
								await redis.call('JSON.SET', toKeyName, '$', Value);
								returnData.push({
									json: {
										operation: 'both',
										toKeyName,
										Value,
									},
								});
							}
						}
					} else if (redisDataType === 'stream-stream') {
						// Read from stream and write to stream
						if (fromKeyName) {
							list = await redis.call('xrange', fromKeyName, '-', '+');
							returnData.push({
								json: {
									operation: 'both',
									fromKeyName,
									list,
								},
							});
						}
						if (toKeyName && path) {
							// Write to JSON
							await redis.call('xadd', toKeyName, '*', path, Value);
							returnData.push({
								json: {
									operation: 'both',
									Value,
									toKeyName,
								},
							});
						}
						if (toKeyName) {
							// Write to stream
							await redis.call('xadd', toKeyName, '*', 'value', JSON.stringify(Value));
							returnData.push({
								json: {
									operation: 'both',
									Value,
									toKeyName,
								},
							});
						}
					} else if (redisDataType === 'json-stream') {
						// Read from JSON and write to stream
						if (fromKeyName) {
							list = await redis.call('JSON.GET', fromKeyName);

							returnData.push({
								// Read from JSON
								json: {
									operation: 'both',
									fromKeyName,
									list,
									toKeyName,
								},
							});
						}

						if (list && list.length > 0) {
							// Check if list is not empty
							if (toKeyName) {
								await redis.call('xadd', toKeyName, '*', 'json', list);
								await redis.xgroup('CREATE', toKeyName, groupName, '0', 'MKSTREAM');
								await redis.xgroup('CREATECONSUMER', toKeyName, groupName, consumer);
								returnData.push({
									// Write to stream
									json: {
										operation: 'both',
										list,
										toKeyName,
										fromKeyName,
									},
								});
							}
						}
					} else if (redisDataType === 'stream-json') {
						// Read from stream and write to JSON
						if (fromKeyName) {
							list = await redis.xreadgroup(
								// Read from stream
								'GROUP',
								groupName,
								consumer,
								'STREAMS',
								fromKeyName,
								'>',
							);

							returnData.push({
								json: {
									operation: 'both',
									fromKeyName,
									list,
									toKeyName,
								},
							});
						}
						if (list && list.length > 0) {
							// Check if list is not empty
							if (toKeyName) {
								// Write to JSON
								await redis.call('JSON.SET', toKeyName, '$', JSON.stringify(list)); // Convert list to JSON
								returnData.push({
									// Write to JSON
									json: {
										operation: 'both',
										list,
										toKeyName,
										fromKeyName,
									},
								});
							}
						}
					}
				}
			} catch (error) {
				// Handle errors
				console.error('Redis Error:', error.message); // Log the error
				throw new NodeOperationError(this.getNode(), 'Redis Error: ' + error.message); // Re-throw the error
			}
		}

		return [returnData];
	}
}
