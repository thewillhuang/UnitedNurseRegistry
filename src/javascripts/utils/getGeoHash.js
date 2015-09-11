import Promise from 'bluebird';
import geohash from 'ngeohash';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const getCurrentGeoHash = () => {
  return new Promise(function(fulfill, reject) {
    const success = (pos) => {
      const geoHash = geohash.encode(pos.coords.latitude, pos.coords.longitude, 3);
      const geoHashSet = geohash.neighbors(geoHash);
      fulfill({geoHash, geoHashSet});
    };
    const error = (err) => {
      reject(err);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  });
};

export default getCurrentGeoHash;
