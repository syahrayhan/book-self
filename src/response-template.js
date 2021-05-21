const failedResponse = (responseMessage = '', responseData = {}, withData = false) => {
  if (withData) {
    return {
      status: 'fail',
      message: responseMessage,
      data: responseData
    }
  }

  return {
    status: 'fail',
    message: responseMessage
  }
}

const errorResponse = (responseMessage = '') => ({
  status: 'fail',
  message: responseMessage
})

const successResponse = (responseMessage = '', responseData = {}) => ({
  status: 'success',
  message: responseMessage,
  data: responseData
})

module.exports = { failedResponse, errorResponse, successResponse }
