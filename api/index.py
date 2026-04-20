from flask import Flask, render_template, jsonify, request
import yfinance as yf
import requests

app = Flask(__name__, template_folder="../templates", static_folder="../static")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/stock")
def get_stock():
    symbol = request.args.get("symbol", "AAPL")
    period = request.args.get("period", "1mo")

    ticker = yf.Ticker(symbol)
    hist = ticker.history(period=period)

    data = {
        "labels": [str(d.date()) for d in hist.index],
        "prices": [round(p, 2) for p in hist["Close"].tolist()],
        "symbol": symbol.upper()
    }
    return jsonify(data)

@app.route("/api/crypto")
def get_crypto():
    coin = request.args.get("coin", "bitcoin")
    days = request.args.get("days", "30")

    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart"
    params = {"vs_currency": "usd", "days": days}
    res = requests.get(url, params=params).json()

    prices = res.get("prices", [])
    data = {
        "labels": [
            __import__("datetime").datetime.fromtimestamp(p[0]/1000).strftime("%m-%d")
            for p in prices[::max(1, len(prices)//60)]
        ],
        "prices": [round(p[1], 2) for p in prices[::max(1, len(prices)//60)]],
        "coin": coin
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
