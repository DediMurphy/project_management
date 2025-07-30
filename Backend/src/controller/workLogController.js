import sendResponse from "../middlewares/responseFormatter.js";
import * as workLogService from "../service/worklogService.js";

export const getAllWorkLog = async (req, res, next) => {
  try {
    const dateParam = req.query.date;
    const worklogs = dateParam
      ? await workLogService.getWorkByDate(dateParam, req.user)
      : await workLogService.getAllWorkLog(req.user);

    sendResponse(res, {
      statusCode: 200,
      message: dateParam
        ? `Worklogs for date ${dateParam} retrieved successfully`
        : "All worklogs retrieved successfully",
      data: worklogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getLogById = async (req, res, next) => {
  try {
    const logId = parseInt(req.params.id);
    const worklog = await workLogService.getWorkLogByUser(logId);
    sendResponse(res, {
      statusCode: 200,
      message: `Worklog with ID ${logId} retrieved successfully`,
      data: worklog,
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkLog = async (req, res, next) => {
  try {
    const worklogData = { ...req.body };
    const worklog = await workLogService.addWorkLog(worklogData);
    sendResponse(res, {
      statusCode: 201,
      message: "Worklog created successfully",
      data: worklog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorklog = async (req, res, next) => {
  try {
    const logId = parseInt(req.params.id);
    const worklogData = { ...req.body };
    const updateLog = await workLogService.editWorkLog(logId, worklogData);
    console.log("params.id:", req.params.id);
    sendResponse(res, {
      statusCode: 200,
      message: `Worklog with ID ${logId} updated successfully`,
      data: updateLog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkLog = async (req, res, next) => {
  try {
    const logId = parseInt(req.params.id);
    const worklog = await workLogService.removeWorkLog(logId);
    sendResponse(res, {
      statusCode: 200,
      message: `Worklog with ID ${logId} deleted successfully`,
      data: worklog,
    });
  } catch (error) {
    next(error);
  }
};
