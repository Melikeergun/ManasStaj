
class DateUtils3 {
    static formatHour(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    }
  
    static formatDay(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  
    static formatMonth(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long' });
    }
  
    static formatYear(dateString) {
      const date = new Date(dateString);
      return date.getFullYear();
    }
  
    static formatFullDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
  
  export default DateUtils3;
  