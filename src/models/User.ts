interface User {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  login: {
    uuid: string;
    username: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  phone: string;
  cell: string;
  email: string;
  picture: {
    thumbnail: string;
  };
}

export default User;
