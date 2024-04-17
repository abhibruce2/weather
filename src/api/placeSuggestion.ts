export const fetchCities = async (search: string) => {
  const url =
  `https://api.opencagedata.com/geocode/v1/json?q=${search}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=en`
  const res = await (
    await fetch(url, {
      method: 'GET',
    })
  ).json();

  return res.results
   

};
