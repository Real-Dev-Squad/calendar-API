import express from 'express';
import health from './health';
import auth from './auth';
import users from './users';
import calendar from './calendar';
import events from './events';

const app = express();

app.use('/auth', auth);
app.use('/health', health);
app.use('/users', users);
app.use('/calendar', calendar);
app.use('/events', events);

export default app;
