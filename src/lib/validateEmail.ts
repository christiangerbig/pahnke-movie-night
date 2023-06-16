export const validateEmail = (value: string) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const emailDomain = value.split("@")[1] || "";
  const allowedDomains = ["pahnke.de", "pushh.it", "pinc.de", "fluent.de"];

  if (!emailRegex.test(value)) {
    return "Keine gültige E-Mail-Adresse";
  }

  if (!allowedDomains.includes(emailDomain)) {
    return "E-Mail Provider nicht zugelassen";
  }

  return false;
};
