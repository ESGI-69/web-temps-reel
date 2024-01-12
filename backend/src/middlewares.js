// import jwt from 'jsonwebtoken';
// import userService from './service/user';

/**
 * User population middleware. This middleware will populate the user in the request object from the JWT token.
 */
const populateUser = (req, res, next) => {
  // if (!process.env.JWT_SECRET) return next(new Error('JWT_SECRET not set'));
  // if (
  //   req.headers.authorization
  //   && req.headers.authorization?.split(' ').length === 2
  //   && req.headers.authorization.startsWith('Bearer')
  // ) {
  //   const token = req.headers.authorization?.split(' ')[1];
  //   try {
  //     const { id } = jwt.verify(token, process.env.JWT_SECRET);
  //     req.user = await userService.findById(id);
  //     if (!req.user) return res.sendStatus(401);
  //     next();
  //   } catch (err) {
  //     return res.sendStatus(401);
  //   }
  // } else {
  next();
  // }
};

const isLogged = (req, res, next) => {
  if (!req.user) return res.status(401).send({
    code: 'not_logged_in',
    message: 'Not logged in',
  });
  next();
};

export {
  populateUser,
  isLogged,
};
