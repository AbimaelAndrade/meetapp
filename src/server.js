import app from './app';

const PORT = process.env.APP_PORT || 3333;

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
