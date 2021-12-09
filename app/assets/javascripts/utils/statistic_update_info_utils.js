import moment from 'moment';

const firstUpdateTime = (first_update) => {
  const latency = Math.round(first_update.queue_latency);
  const enqueuedAt = moment(first_update.enqueued_at);
  return moment(enqueuedAt).add(latency, 'seconds');
};

const lastSuccessfulUpdateMoment = (update_logs) => {
  const updateTimesLogs = Object.values(update_logs).filter(log => log.end_time !== undefined);
  if (updateTimesLogs.length === 0) return null;
  const lastSuccessfulUpdateTime = updateTimesLogs[updateTimesLogs.length - 1].end_time;
  return moment.utc(lastSuccessfulUpdateTime);
};

const getLastUpdateMessage = (course) => {
  let lastUpdateMessage = '';
  let nextUpdateMessage = '';
  let isNextUpdateAfter = false;
  const lastUpdateMoment = lastSuccessfulUpdateMoment(course.flags.update_logs);
  if (lastUpdateMoment) {
    const averageDelay = course.updates.average_delay;
    lastUpdateMessage = `${I18n.t('metrics.last_update')}: ${lastUpdateMoment.fromNow()}.`;
    const nextUpdateExpectedTime = lastUpdateMoment.add(averageDelay, 'seconds');
    isNextUpdateAfter = nextUpdateExpectedTime.isAfter();
    nextUpdateMessage = `${I18n.t('metrics.next_update')}: ${nextUpdateExpectedTime.fromNow()}.`;
  }
  return [lastUpdateMessage, nextUpdateMessage, isNextUpdateAfter];
};

const nextUpdateExpected = (course) => {
  if (!course.flags.update_logs) {
   return firstUpdateTime(course.flags.first_update).fromNow();
  }
  if (lastSuccessfulUpdateMoment(course.flags.update_logs) === null) {
    return 'unknown';
  }
  const lastUpdateMoment = lastSuccessfulUpdateMoment(course.flags.update_logs);
  const averageDelay = course.updates.average_delay || 0;
  const nextUpdateTime = lastUpdateMoment.add(averageDelay, 'seconds');
  return nextUpdateTime.fromNow();
};


const getUpdateMessage = (course) => {
  if (!course.flags.update_logs) {
    return getFirstUpdateMessage(course);
  }
  const successfulUpdate = lastSuccessfulUpdateMoment(course.flags.update_logs);
  if (course.flags.update_logs && successfulUpdate !== null) {
    return getLastUpdateMessage(course);
  }
  return [`${I18n.t('metrics.no_update')}`, '', ''];
};

const getFirstUpdateMessage = (course) => {
  let lastUpdateMessage = '';
  let nextUpdateMessage = '';
  let isNextUpdateAfter = false;
  if (course.flags.first_update) {
    const nextUpdateExpectedTime = firstUpdateTime(course.flags.first_update);
    isNextUpdateAfter = nextUpdateExpectedTime.isAfter();
    nextUpdateMessage = `${I18n.t('metrics.first_update')}: ${nextUpdateExpectedTime.fromNow()}.`;
    lastUpdateMessage = `${I18n.t('metrics.enqueued_update')}`;
  } else {
    lastUpdateMessage = `${I18n.t('metrics.no_update')}`;
  }
  return [lastUpdateMessage, nextUpdateMessage, isNextUpdateAfter];
};

const getLastUpdateSummary = (course) => {
  if (course.updates.last_update === null || lastSuccessfulUpdateMoment(course.flags.update_logs) === null) {
    return I18n.t('metrics.no_update');
  }
  const errorCount = course.updates.last_update.error_count;
  if (errorCount === 0) {
    return `${I18n.t('metrics.last_update_success')}`;
  } else if (errorCount > 0) {
    return `${I18n.t('metrics.error_count_message', { error_count: errorCount })}`;
  } else if (course.updates.last_update.orphan_lock_failure) {
    return `${I18n.t('metrics.last_update_failed')}`;
  }
};

const getTotaUpdatesMessage = (course) => {
  if (!course.flags.update_logs) {
    return `${I18n.t('metrics.total_updates')}: 0.`;
  }
  const updateNumbers = Object.keys(course.flags.update_logs);
  return `${I18n.t('metrics.total_updates')}: ${updateNumbers[updateNumbers.length - 1]}.`;
};

const getUpdateLogs = (course) => {
  if (course.flags.update_logs) {
    return Object.values(course.flags.update_logs);
  }
  return [];
};
export { getUpdateMessage, getLastUpdateMessage, getFirstUpdateMessage, firstUpdateTime, lastSuccessfulUpdateMoment, nextUpdateExpected, getLastUpdateSummary, getTotaUpdatesMessage, getUpdateLogs };
