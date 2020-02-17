const defaultConfig = {
  navigationTimeout: 30000, //Millisecond
  observeTime: 3000, //Millisecond
  retryInterval: 100, //Millisecond
  retryTimeout: 10000, //Millisecond
  observe: false,
  waitForNavigation: true,
  ignoreSSLErrors: false,
  headful: false,
  highlightOnAction: process.env.TAIKO_HIGHLIGHT_ON_ACTION || 'true',
};

const setConfig = options => {
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(defaultConfig, key)) {
      if (typeof defaultConfig[key] !== typeof options[key]) {
        throw new Error(
          `Invalid value for ${key}. Expected ${typeof defaultConfig[
            key
          ]} received ${typeof options[key]}`,
        );
      }
      defaultConfig[key] = options[key];
    } else {
      throw new Error(
        `Invalid config ${key}. Allowed configs are ${Object.keys(defaultConfig).join(', ')}`,
      );
    }
  }
};

const getConfig = name => {
  if (name) {
    if (Object.prototype.hasOwnProperty.call(defaultConfig, name)) {
      return defaultConfig[name];
    } else {
      throw new Error(
        `Invalid config ${name}. Allowed configs are ${Object.keys(defaultConfig).join(', ')}`,
      );
    }
  } else {
    return Object.assign({}, defaultConfig);
  }
};

const setBrowserOptions = options => {
  options.port = options.port || 0;
  options.host = options.host || '127.0.0.1';
  options.headless =
    options.headless === undefined || options.headless === null ? true : options.headless;
  const observe = _determineValueFor('observe', options.observe);
  setConfig({
    observeTime: determineObserveDelay(observe, options.observeTime),
    observe: observe,
    ignoreSSLErrors: _determineValueFor('ignoreSSLErrors', options.ignoreCertificateErrors),
    headful: !options.headless,
  });
  return options;
};

const setNavigationOptions = options => {
  options.waitForNavigation = determineWaitForNavigation(options.waitForNavigation);
  options.navigationTimeout = options.navigationTimeout || defaultConfig.navigationTimeout;
  options.waitForStart = options.waitForStart || 100;
  return options;
};

const setClickOptions = (options, x, y) => {
  options = setNavigationOptions(options);
  options.x = x;
  options.y = y;
  options.button = options.button || 'left';
  options.clickCount = options.clickCount || 1;
  options.elementsToMatch = options.elementsToMatch || 10;
  return options;
};

const determineObserveDelay = (shouldObserve, observeTime) => {
  if (shouldObserve) {
    return _determineValueFor('observeTime', observeTime);
  } else {
    return observeTime || 0;
  }
};

const determineWaitForNavigation = waitForNavigation => {
  return _determineValueFor('waitForNavigation', waitForNavigation);
};

const determineRetryInterval = retryInterval => {
  return _determineValueFor('retryInterval', retryInterval);
};

const determineRetryTimeout = retryTimeout => {
  return _determineValueFor('retryTimeout', retryTimeout);
};

const _determineValueFor = (configName, providedValue) => {
  return _hasValue(providedValue) ? providedValue : defaultConfig[configName];
};

const _hasValue = value => {
  return !(value === undefined || value === null);
};

module.exports = {
  defaultConfig,
  setConfig,
  getConfig,
  determineWaitForNavigation,
  determineRetryInterval,
  determineRetryTimeout,
  setNavigationOptions,
  setClickOptions,
  setBrowserOptions,
};
