function removeTimestamps(text) {
    // Regular expression to match timestamps in the format [hh:mm:ss] or hh:mm:ss
    const timestampRegex = /\[?\d{1,2}:\d{2}:\d{2}\]?\s?/g;
    // Replace timestamps with an empty string
    return text.replace(timestampRegex, '');
}

removeTimestamps("")