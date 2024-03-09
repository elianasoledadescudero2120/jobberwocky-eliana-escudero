export const successResponse = (res, data) => {
    return res.status(200).json({
        success: true,
        data,
    });
}

export const errorResponse = (res, err) => {
    if(err.message) console.log('--- ERROR: ---', err.message);
    return res.status(500).json({
        success: false,
        error: err,
    });
}