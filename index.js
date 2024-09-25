import inputData from "./data.json" assert { type: "json" };

const convert = (dataToConvert) => {
  validateInputData(dataToConvert);

  const { deviceInfo, time, data } = dataToConvert;
  const hexPayload = base64ToHex(data);
  const battery = hexPayload.slice(0, 6);
  const temperature = hexPayload.slice(6, 14);
  const humidity = hexPayload.slice(14);

  const convertedData = {
    deviceName: deviceInfo.deviceName,
    deviceType: deviceInfo.deviceProfileName,
    attributes: {
      devEui: deviceInfo.devEui,
    },
    telemetry: {
      ts: new Date(time).getTime(),
      values: {
        battery: formatHexValue(battery),
        temperature: formatHexValue(temperature),
        humidity: formatHexValue(humidity),
      },
    },
  };

  return JSON.stringify(convertedData);
};

const formatHexValue = (hexCode) => {
  const valueToConvert = hexCode.slice(4);
  return hexCode.length === 8
    ? parseInt(valueToConvert, 16) / 100
    : parseInt(valueToConvert, 16);
};

const base64ToHex = (data) => {
  return Buffer.from(data, "base64").toString("hex");
};

const validateField = (condition, errorMessage) => {
  if (condition) throw new Error(errorMessage);
};

const validateInputData = (dataToConvert) => {
  if (
    typeof dataToConvert !== "object" ||
    dataToConvert === null ||
    Array.isArray(dataToConvert)
  ) {
    throw new Error("Input data must be a non-null, non-array object.");
  }

  const { deviceInfo, time, data } = dataToConvert;

  validateField(!deviceInfo, "Missing 'deviceInfo' field in input data.");
  validateField(!time, "Missing 'time' field in input data.");
  validateField(!data, "Missing 'data' field in input data.");

  const { deviceName, deviceProfileName, devEui } = deviceInfo;

  validateField(!deviceName, "Missing 'deviceName' in 'deviceInfo'.");
  validateField(
    !deviceProfileName,
    "Missing 'deviceProfileName' in 'deviceInfo'."
  );
  validateField(!devEui, "Missing 'devEui' in 'deviceInfo'.");
  validateField(typeof time !== "string", "'time' must be a string.");
  validateField(typeof data !== "string", "'data' must be a string.");
  validateField(
    typeof deviceName !== "string",
    "'deviceName' must be a string."
  );
  validateField(
    typeof deviceProfileName !== "string",
    "'deviceProfileName' must be a string."
  );
  validateField(typeof devEui !== "string", "'devEui' must be a string.");
};

const convertedData = convert(inputData);
console.log(convertedData);
