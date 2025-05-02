class DateUtils2 {
  static formatHour(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  static formatDay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  static formatMonth(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  }

  static formatYear(dateString) {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  }

  static formatFullDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}

export default DateUtils2;
