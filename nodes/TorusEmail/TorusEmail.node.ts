import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import * as https from 'https';

export class TorusEmail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Torus Email',
		name: 'torusEmail',
		icon: 'file:logo_original.png',
		group: ['transform'],
		version: 1,
		description: 'Basic Send Node',
		defaults: {
			name: 'Torus Email',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Email id',
				name: 'emailId',
				type: 'string',
				default: '',
				placeholder: 'Enter email id',
				description: 'The email id',
			},
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
	 * Executes the function asynchronously, sending a message using the provided user name and key.
	 *
	 * @return {Promise<INodeExecutionData[][]>} A promise that resolves to an array of execution data.
	 * @throws {NodeOperationError} If the user name or key is not provided.
	 * @throws {NodeOperationError} If the request to send the message fails.
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Retrieve input data
		const items = this.getInputData();
		// Initialize array to store output data
		const returnData: INodeExecutionData[] = [];

		// Loop through each input item
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			// Retrieve user name and key from node properties
			const userName = this.getNodeParameter('userName', itemIndex) as string;
			const key = this.getNodeParameter('key', itemIndex) as string;
			const emailId = this.getNodeParameter('emailId', itemIndex) as string;

			// Validate user name and key
			if (!userName) {
				throw new NodeOperationError(this.getNode(), 'User Name is not provided.');
			}
			if (!key) {
				throw new NodeOperationError(this.getNode(), 'Key is not provided.');
			}
			if (!emailId) {
				throw new NodeOperationError(this.getNode(), 'Mobile No is not provided.');
			}

			// Construct data to be sent in the POST request
			const postData = JSON.stringify({
				recipients: [
					{
						to: [
							{
								email: emailId,
							},
						],
						variables: {
							user: userName,
							key: key,
						},
					},
				],
				from: {
					name: 'Torus',
					email: 'support@torus.tech',
				},
				domain: 'torus.tech',
				reply_to: [
					{
						email: 'support@torus.tech',
					},
				],

				template_id: 'torusdynamic',
			});

			// Configure options for the HTTPS request
			const options = {
				method: 'POST',
				hostname: 'control.msg91.com',
				port: null,
				path: '/api/v5/email/send',
				headers: {
					accept: 'application/json',
					authkey: '420972AM9QWK7e0NgN6630cf7cP1',
					'content-type': 'application/JSON',
				},
			};

			// Create a promise for the API request
			const sendRequest = new Promise<void>((resolve, reject) => {
				// Send the HTTPS request
				const req = https.request(options, (res) => {
					const chunks: Buffer[] = [];

					// Event listener for response data
					res.on('data', (chunk: Buffer) => {
						chunks.push(chunk);
					});

					// Event listener for end of response
					res.on('end', () => {
						// Concatenate response data
						const body = Buffer.concat(chunks);
						console.log(body.toString());

						// Check if the message was sent successfully
						const success = true; // Assuming success for demonstration

						// Add success status to the return data
						returnData.push({
							json: {
								success: success,
							},
						});

						// Resolve the promise
						resolve();
					});
				});

				// Event listener for request error
				req.on('error', (error: Error) => {
					console.error(error);
					// Reject the promise if there's an error
					reject(error);
				});

				// Write the POST data to the request and end it
				req.write(postData);
				req.end();
			});

			try {
				// Wait for the request to complete
				await sendRequest;
			} catch (error) {
				// Throw an error if the request fails
				throw new NodeOperationError(this.getNode(), `Failed to send message: ${error.message}`);
			}
		}

		// Return the collected data
		return [returnData];
	}
}
