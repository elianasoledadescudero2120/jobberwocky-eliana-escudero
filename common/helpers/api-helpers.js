const successResponse = (res, data, code, extra) => {
    return res.status(code || 200).json({
        success: true,
        data,
        ...(extra && { extra })
    });
}

const errorResponse = (res, { message, code, extra }) => {
    if(message) console.log('--- ERROR: ---', message);
    return res.status(code || 500).json({
        success: false,
        error: { message, extra },
    });
}

export const executeQuery = async (req, res, action) => {
    try {
      const { data, code, extra } =  await action(req);
      return successResponse(res, data, code, extra);
    }
    catch (err) {
      return errorResponse(res, err);
    }
}