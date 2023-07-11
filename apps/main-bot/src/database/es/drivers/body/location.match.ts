import { IFindOptions, IFindSettings } from '../types';

export function addLocationMatch(
  body: any,
  options: IFindOptions,
  settings: IFindSettings,
  forCount: boolean,
) {
  const { location } = options;

  if (!location) {
    return;
  }

  const { maxRadius, boostGeoScore, pivotGeoScore } = settings;

  const { latitude: lat, longitude: lon } = location;

  if (boostGeoScore && pivotGeoScore) {
    body.query.bool.should.push({
      distance_feature: {
        field: 'location',
        pivot: `${pivotGeoScore}m`,
        boost: boostGeoScore,
        origin: [lon, lat],
      },
    });
  }

  if (!forCount) {
    body.script_fields = {
      distance: {
        script: `if (!doc['location'].empty) {
  return doc['location'].arcDistance(${lat}, ${lon}) / 1000
 } else {
  return 0;
}`,
      },
    };
  }

  body.query.bool.filter.bool.should.push({
    geo_distance: {
      distance: `${maxRadius}km`,
      location: {
        lat,
        lon,
      },
    },
  });
}
