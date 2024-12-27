export const FolderValidationRules = {
  nameMinLength: 1,
  nameMaxLength: 100,
};

export const STRING_FIELD_REGEX =
  /^[a-zA-Z0-9\s_@!#\$\^%&*()+=\-\[\]\\‘;,\.\/\{\}\|\“\'\"\`:<>\?]*$/;
export const STRING_FIELD_ERROR_MESSAGE = (filed: string): string =>
  `Allowed ${filed} symbols: Alphanumeric, @!#$^%&*()+=-[]\\‘';,./{}|“"\`:<>?`;
