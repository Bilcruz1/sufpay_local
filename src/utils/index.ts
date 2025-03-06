export interface QueryParams {
  [name: string]: boolean | string | number | null | undefined;
}

export function queryBuilder(obj?: QueryParams | URLSearchParams): string {
  if (obj === undefined) return "";
  let query: string = "?";
  if (obj instanceof URLSearchParams) {
    query += obj.toString();
    return query;
  } else {
    let arr = Object.entries(obj).map(([k, v]) => {
      if (v !== undefined) return `${k}=${v}`;
    });
    return arr.length > 0 ? query + arr.join("&") : "";
  }
}
export function toURLSearchParam(obj: QueryParams) {
  const urls = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      urls.append(k, v.toString());
    }
  });
  return urls;
}
export function success(code: number | string) {
  return (
    (typeof code === "number" && code >= 200 && code < 300) ||
    code.toString().toLowerCase().includes("success")
  );
}

export const extractNames = (fullname: string) => {
  const splitName = fullname.split(" ");
  if (splitName.length === 2) {
    const [first, last] = splitName;
    const middle = "";
    return { first, middle, last };
  } else
    return {
      first: splitName[0],
      middle: splitName[1] || "",
      last: splitName[2] || "",
    };
};

export function paramsToArray(params: any) {
  const array: any[] = [];
  for (let param in params) {
    array.push(params[param]);
  }
  return array;
}

export const zonesArray = [
  {
    code: "NC",
    name: "NORTH CENTRAL",
  },
  {
    code: "NW",
    name: "NORTH WEST",
  },
  {
    code: "NE",
    name: "NORTH EAST",
  },
  {
    code: "SS",
    name: "SOUTH SOUTH",
  },
  {
    code: "SW",
    name: "SOUTH WEST",
  },
  {
    code: "SE",
    name: "SOUTH EAST",
  },
];

export const statesArray = [
  {
    code: "001",
    name: "ABIA",
  },
  {
    code: "002",
    name: "ADAMAWA",
  },
  {
    code: "003",
    name: "AKWA-IBOM",
  },
  {
    code: "004",
    name: "ANAMBRA",
  },
  {
    code: "005",
    name: "BAUCHI",
  },
  {
    code: "006",
    name: "BENUE",
  },
  {
    code: "007",
    name: "BORNO",
  },
  {
    code: "008",
    name: "CROSS-RIVER",
  },
  {
    code: "009",
    name: "DELTA",
  },
  {
    code: "010",
    name: "EDO",
  },
  {
    code: "011",
    name: "ENUGU",
  },
  {
    code: "012",
    name: "IMO",
  },
  {
    code: "013",
    name: "JIGAWA",
  },
  {
    code: "014",
    name: "KADUNA",
  },
  {
    code: "015",
    name: "KANO",
  },
  {
    code: "016",
    name: "KATSINA",
  },
  {
    code: "017",
    name: "KEBBI",
  },
  {
    code: "018",
    name: "KOGI",
  },
  {
    code: "019",
    name: "KWARA",
  },
  {
    code: "020",
    name: "LAGOS",
  },
  {
    code: "021",
    name: "NIGER",
  },
  {
    code: "022",
    name: "OGUN",
  },
  {
    code: "023",
    name: "ONDO",
  },
  {
    code: "024",
    name: "OSUN",
  },
  {
    code: "025",
    name: "OYO",
  },
  {
    code: "026",
    name: "PLATEAU",
  },
  {
    code: "027",
    name: "RIVERS",
  },
  {
    code: "028",
    name: "SOKOTO",
  },
  {
    code: "029",
    name: "TARABA",
  },
  {
    code: "030",
    name: "YOBE",
  },
  {
    code: "031",
    name: "FCT-ABUJA",
  },
  {
    code: "032",
    name: "BAYELSA",
  },
  {
    code: "033",
    name: "EBONYI",
  },
  {
    code: "034",
    name: "EKITI",
  },
  {
    code: "035",
    name: "GOMBE",
  },
  {
    code: "036",
    name: "NASARAWA",
  },
  {
    code: "037",
    name: "ZAMFARA",
  },
];
export const countriesArray = [
  {
    code: "001",
    name: "NIGERIA",
  },
  {
    code: "074",
    name: "TOGO",
  },
  {
    code: "038",
    name: "EQUATORIAL GUINEA",
  },
  {
    code: "042",
    name: "GABON",
  },
  {
    code: "070",
    name: "BENIN REPUBLIC",
  },
  {
    code: "040",
    name: "NIGER REPUBLIC",
  },
];

export const blobToBase64 = (blob: any, callback: any) => {
  let reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function () {
    callback(reader.result);
  };
};

export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
