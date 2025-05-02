class DateUtils {
  // Tarih formatını "hh:mm" olarak döndüren statik yöntem
  static formatHour(dateString)
   {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes}`;
  }

  // Tarih formatını "DD" olarak döndüren statik yöntem
  static formatDay(dateString)
   {
    const date = new Date(dateString);
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${day}`;
  }

  // Tarih formatını "MM" olarak döndüren statik yöntem
  static formatMonth(dateString) 
  {
    const date = new Date(dateString);
    let month = date.getMonth() + 1; // Aylar 0-11 arasında döner
    month = month < 10 ? `0${month}` : month;
    return `${month}`;
  }

  // Tarih formatını "YYYY" olarak döndüren statik yöntem
  static formatYear(dateString) 
  {
    const date = new Date(dateString);
    return `${date.getFullYear()}`;
  }

  // Tarih formatını "DD-MM-YYYY" olarak döndüren statik yöntem
  static formatFullDate(dateString)
   {
    return `${this.formatDay(dateString)}-${this.formatMonth(dateString)}-${this.formatYear(dateString)}`;
  }

  // Tarih formatını "YYYY-MM" olarak döndüren statik yöntem
  static formatYearMonth(dateString)
   {
    const date = new Date(dateString);
    return `${this.formatYear(dateString)}-${this.formatMonth(dateString)}`;
  }

  // Tarih formatını "YYYY-MM-DD" olarak döndüren statik yöntem
  static formatYearMonthDay(dateString) 
  {
    return `${this.formatYear(dateString)}-${this.formatMonth(dateString)}-${this.formatDay(dateString)}`;
  }
}

export default DateUtils;
