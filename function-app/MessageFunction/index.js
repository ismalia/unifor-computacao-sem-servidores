const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

const accountName = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;
const tableName = "Messages";

const credential = new AzureNamedKeyCredential(accountName, accountKey);
const client = new TableClient(
    `https://${accountName}.table.core.windows.net`,
    tableName,
    credential
);

module.exports = async function (context, req) {
    context.log('Processing a message request.');

    try {
        if (req.method === "POST") {
            // Handle the POST request to save a new message
            const { title, description } = req.body;

            if (!title || !description) {
                context.res = {
                    status: 400,
                    body: "Please provide both a title and a description."
                };
                return;
            }

            // Create a unique ID for the message
            const timestamp = new Date().getTime().toString();
            const messageId = `message-${timestamp}`;

            // Create an entity to store in Table Storage
            const entity = {
                partitionKey: "messages",
                rowKey: messageId,
                title,
                description,
                timestamp: new Date().toISOString()
            };

            // Add the entity to the table
            await client.createEntity(entity);

            context.res = {
                status: 201,
                body: {
                    id: messageId,
                    title,
                    description,
                    timestamp: entity.timestamp
                }
            };
        } else if (req.method === "GET") {
            // Handle the GET request to retrieve all messages
            const entities = [];
            const iter = client.listEntities();

            for await (const entity of iter) {
                entities.push({
                    id: entity.rowKey,
                    title: entity.title,
                    description: entity.description,
                    timestamp: entity.timestamp
                });
            }

            context.res = {
                status: 200,
                body: entities
            };
        } else {
            context.res = {
                status: 405,
                body: "Method not allowed. Only POST and GET are supported."
            };
        }
    } catch (error) {
        context.log.error("Error processing request:", error);
        context.res = {
            status: 500,
            body: "An error occurred while processing your request."
        };
    }
};
