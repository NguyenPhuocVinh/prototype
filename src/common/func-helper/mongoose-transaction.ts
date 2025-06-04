import { ClientSession, Connection } from "mongoose";
import { appSettings } from "src/configs/app.config";

const { mongoose } = appSettings
const { isReplicaSet } = mongoose;

/**
 * Handles a MongoDB transaction using Mongoose.
 * @param method - The method to execute within the transaction.
 * @param onError - Callback function to handle errors.
 * @param connection - The Mongoose connection to use.
 * @param session - Optional pre-existing session to use for the transaction.
 * @returns The result of the executed method or undefined if an error occurred.
 */

export const mongooseTransactionHandler = async <T = any>(
    method: (session: ClientSession) => Promise<T>,
    onError: (error: any) => any,
    connection: Connection,
    session?: ClientSession,
) => {
    let error: any;
    let result: T;

    if (!isReplicaSet) {
        const isSessionFurnished = session === undefined ? false : true;
        if (isSessionFurnished === false) {
            session = await connection.startSession();
            session.startTransaction();
        }

        try {
            result = await method(session);

            if (isSessionFurnished === false) {
                await session.commitTransaction();
            }
        } catch (err) {
            error = err;
            if (isSessionFurnished === false) {
                await session.abortTransaction();
            }
        } finally {
            if (isSessionFurnished === false) {
                await session.endSession();
            }

            if (error) {
                onError(error);
            }
        }
    }

    if (isReplicaSet) {
        try {
            await session.withTransaction(
                async () => {
                    result = await method(session);
                },
                {
                    readPreference: 'primary',
                    readConcern: { level: 'local' },
                    writeConcern: { w: 'majority' },
                },
            );
        } catch (err) {
            error = err;
        } finally {
            await session.endSession();

            if (error) {
                onError(error);
            }

            return result;
        }
    }
}