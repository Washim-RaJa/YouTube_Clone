// const API_KEY = `${import.meta.env.VITE_YT_DATA_API_KEY}`;

// export const API_KEY = "AIzaSyB53A7SlbnBmoafQAH_v6SCz5_j6VLh-d0";

export const value_converter = (value) => {
    if (value >= 1000000) {
        return Math.floor(value/1000000) + "M"
    }else if (value >= 1000) {
        return Math.floor(value/1000) + "k"
    }else{
        return value;
    }
}