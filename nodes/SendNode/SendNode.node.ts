import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import * as https from 'https';
export class SendNode implements INodeType {
	// Create a class that implements the INodeType interface
	description: INodeTypeDescription = {
		// Define the description of the SendNode
		displayName: 'Torus Msg', // The display name of the SendNode
		name: 'torusMsg', // The name of the SendNode
		group: ['transform'], // The group of the SendNode
		version: 1, // The version of the SendNode
		description: 'Basic Send Node', // The description of the SendNode
		defaults: {
			// The default values of the SendNode
			name: 'Torus Msg', // The name of the SendNode
		},
		inputs: ['main'], // The inputs of the SendNode
		outputs: ['main'], // The outputs of the SendNode
		properties: [
			// The properties of the SendNode
			{
				displayName: 'UserName',
				name: 'userName',
				type: 'string',
				default: '',
				placeholder: 'Enter user Name',
				description: 'The User Name',
			},
			{
				displayName: 'Key',
				name: 'key',
				type: 'string',
				default: '',
				placeholder: 'Enter key',
				description: 'Key',
			},
		],
	};

	/**
	 * Executes the SendNode.
	 *
	 * @return {Promise<INodeExecutionData[][]>} The data returned by the SendNode
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData(); // Get the input data

		const returnData: INodeExecutionData[] = []; // Create an array to store the return data

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			// Iterate over all input items
			const userName = this.getNodeParameter('userName', itemIndex) as string; // Get the user name
			const key = this.getNodeParameter('key', itemIndex) as string; // Get the user name and key

			if (!userName) {
				// Check if the user name is provided
				throw new NodeOperationError(this.getNode(), 'User Name is not provided.'); // Throw an error if the user name is not provided
			}

			if (!key) {
				// Check if the key is provided
				throw new NodeOperationError(this.getNode(), 'Key is not provided.'); // Throw an error if the key is not provided
			}

			const postData = JSON.stringify({
				// Create the JSON data to be sent
				template_id: '66347d70d6fc05441718d253', // Set the template ID
				short_url: '1', // Set the short URL
				recipients: [
					// Set the recipients
					{
						mobiles: '918220182952', // Set the mobile number
						var1: userName, // Set the user name
						var2: key, // Set the key
					},
				],
			});

			const options: https.RequestOptions = {
				// Create the request options
				method: 'POST', // Use the POST method
				hostname: 'control.msg91.com', // Use the control.msg91.com hostname
				port: null, // Use the default port
				path: '/api/v5/flow', // Use the /api/v5/flow path
				headers: {
					// Set the headers
					'Content-Type': 'application/json', // Set the content type to JSON
					authkey: '420972AM9QWK7e0NgN6630cf7cP1', // Set the authkey
				},
			};

			const sendRequest = new Promise<void>((resolve, reject) => {
				// Create a promise
				const req = https.request(options, (res) => {
					// Make the request
					const chunks: Buffer[] = []; // Create an array to store the response chunks

					res.on('data', (chunk: Buffer) => {
						// Handle the response data
						chunks.push(chunk); // Push the chunk to the chunks array
					});

					res.on('end', () => {
						// Handle the end of the response
						const body = Buffer.concat(chunks); // Concatenate the chunks
						console.log(body.toString()); // Print the response body

						const success = true; // Check if the request was successful

						returnData.push({
							// Add the return data to the return array
							json: {
								success: success, // Set the success
							},
						});

						resolve(); // Resolve the promise
					});
				});

				req.on('error', (error: Error) => {
					// Handle errors from the request
					console.error(error);
					reject(error); // Pass errors to rejection handler
				});

				req.write(postData); // Write the POST data
				req.end(); // End the request
			});

			try {
				// Try to send the request
				await sendRequest; // Wait for the promise to resolve
			} catch (error) {
				// Catch any errors
				throw new NodeOperationError(this.getNode(), `Failed to send message: ${error.message}`); // Throw an error if the request fails
			}
		}

		return [returnData]; // Return the return data
	}
}
