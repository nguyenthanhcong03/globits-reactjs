const { set } = require("lodash");
const { useEffect, useState } = require("react");

const useDebounce = (value, delay) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchValue(value);
    }, delay);

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [value]);

  return searchValue;
};

export default useDebounce;
