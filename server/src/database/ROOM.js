import mongoose, { Schema } from "mongoose";

export const ROOM =
    mongoose.models.ROOM ||
    mongoose.model(
        "ROOM",
        new Schema(
            {
                containerId: {
                    type: String,
                    required: true,
                },
                mainTerminalId: {
                    type: String,
                    required: true,
                },
                fileTreeTerminalId: {
                    type: String,
                    required: true,
                },
                editorTerminalId: {
                    type: String,
                    required: true,
                },
            },
            { timestamps: true }
        )
    );
