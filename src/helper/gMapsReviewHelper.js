export const fetchPlaceRatingById = (placeId) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !placeId) {
      reject("Google Maps belum siap atau placeId kosong");
      return;
    }

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails(
      {
        placeId,
        fields: ['rating', 'user_ratings_total'],
      },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve({
            rating: result.rating,
            totalReview: result.user_ratings_total,
          });
        } else {
          reject(`Gagal mengambil rating: ${status}`);
        }
      }
    );
  });
};
