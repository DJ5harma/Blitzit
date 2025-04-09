import mongoose, { Schema } from "mongoose";

export const ROOM =
    mongoose.models.ROOM ||
    mongoose.model(
        "ROOM",
        new Schema(
            {
                containerId: { type: String, required: true },
                MainTerminalId: { type: String, required: true },
                GetFileTreeTerminalId: { type: String, required: true },
                DeleteEntityTerminalId: { type: String, required: true },
                SaveFileTerminalId: { type: String, required: true },
                ReadFileTerminalId: { type: String, required: true },
                CreateEntityTerminalId: { type: String, required: true },
                title: {
                    type: String,
                    required: true,
                },
            },
            { timestamps: true }
        )
    );
