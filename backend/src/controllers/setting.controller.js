import { Setting } from '../models/Setting.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';

export const SettingController = {
  getSetting: asyncHandler(async (req, res) => {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(setting ? setting.value : null, `Setting '${key}' retrieved.`)
    );
  }),

  updateSetting: asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { value, description } = req.body;

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, ...(description ? { description } : {}) },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(setting.value, `Setting '${key}' updated successfully.`)
    );
  }),
};
