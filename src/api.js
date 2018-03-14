export const fetchData = async (term) => {
  try {
    const baseurl = "https://www.googleapis.com/youtube/v3/search?";
    const API_KEY= "AIzaSyAIOBgkjdssPAFvzoB-GyI0dLHMZ0QoyzM";
    const params = {
        part: 'snippet',
        key: API_KEY,
        q: term,
        type: 'video'
    };
    const serialize = function(obj) {
      var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }
    const url = `${baseurl}${serialize(params)}`;
    console.log('url', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('data',data);
    return data;
  } catch (e) {
    console.log(e);
  }
};


