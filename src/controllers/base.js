export class Redirect {
    constructor(url) {
        this.url = url;
    }
}

export const wrap = (handler) => {
    return (req, res, next) => {
        handler(req)
            .then((response) => {
                if (response === undefined) {
                    return res.status(204).send();
                }

                if (response instanceof Redirect) {
                    return res.redirect(response.url);
                }

                res.json(response);
            })
            .catch((err) => next(err));
    };
};
