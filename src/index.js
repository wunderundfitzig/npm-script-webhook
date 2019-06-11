const { send } = require('micro');
const { promisify } = require('util');

const validateReq = require('./lib/validateReq');
const exec = promisify(require('child_process').exec);

// Critical: exit early if the token is not defined.
if (!process.env.NSW_TOKEN || !process.env.NSW_USER) {
  console.error('NO TOKEN OR USER DEFINED, EXITING.');
  process.exit(1);
}

const workDir = process.env.NSW_WORK_DIR || '/var/www/html';
const scriptName = process.env.NSW_SCRIPT_NAME || 'build';
const timeout = process.env.NSW_TIMEOUT || 30 * 1000;

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (err) {
    if (process.env.NODE_ENV && process.NODE_ENV === 'development') {
      console.error(err.stack);
    }
    console.error(err.message);
    if (err.statusCode) {
      return send(res, err.statusCode, err.message);
    }
    return send(res, 500, 'Internal Server Error');
  }
};

module.exports = handleErrors(async (req, res) => {
  await validateReq(req);
  await exec(`npm run ${scriptName}`, {
    cwd: workDir,
    timeout,
  });
  send(res, 204);
});
