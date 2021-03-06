const { logger } = require('./logger');

const messages = {
  prTitle: 'PR Title',
  prBody: 'PR Description',
  spaceBetweenHashtagAndDigit: 'PR contains a space between the hashtag and digit.',
  noIssueReference: 'Issue Reference (`#<issue-number>`) missing.',
  missingGithubKeyword: 'Should contain GitHub keyword to auto-close issue it fixes: Refer [here](https://help.github.com/articles/closing-issues-via-commit-messages/#keywords-for-closing-issues) for a list of accepted keywords.',
};

/**
 * Formats message as a GFMD level two unordered list item
 */
function getFormattedMessageLevelTwoUnordered(message) {
  return `   * ${message}\n`;
}

/**
 * Formats message as a GFMD level two unordered list item
 */
function getFormattedMessageLevelOneOrdered(message) {
  return `1. ${message}\n`;
}

function buildTitleFeedback(violations) {
  if (violations == null) {
    logger.error('Violations is undefined');
    return '';
  }
  if (Object.keys(violations).length === 0) {
    return '';
  }
  let message = '';
  if (violations.main === true) {
    message += getFormattedMessageLevelOneOrdered(messages.prTitle);
    Object.keys(violations.details).forEach((key) => {
      message += getFormattedMessageLevelTwoUnordered(messages[key]);
    });
  }
  return message;
}

function buildDescriptionFeedback(violations) {
  if (violations == null) {
    logger.error('Violations is undefined');
    return '';
  }
  if (Object.keys(violations).length === 0) {
    return '';
  }
  let message = '';
  if (violations.main === true) {
    message += getFormattedMessageLevelOneOrdered(messages.prBody);
    Object.keys(violations.details).forEach((key) => {
      message += getFormattedMessageLevelTwoUnordered(messages[key]);
    });
  }
  return message;
}

module.exports = {
  getFormattedMessageLevelOneOrdered,
  getFormattedMessageLevelTwoUnordered,
  messages,
  /**
   * Returns a string containing the formatted feedback message
   */
  getFeedbackMessage(username, violations, contributingGuidelines) {
    const feedback = `Hi @${username}, these parts of your pull request do not appear to follow our [contributing guidelines](${contributingGuidelines}):\n\n`;

    return feedback
        + buildTitleFeedback(violations.title || {})
        + buildDescriptionFeedback(violations.body || {});
  },
};
