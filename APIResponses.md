# API endpoints

## Wazirx

https://api.wazirx.com/api/v2/tickers

    {
        "btcinr": {
            "base_unit": "btc",
            "quote_unit": "inr",
            "low": "3518627.0",
            "high": "3870457.0",
            "last": "3852288.0",
            "type": "SPOT",
            "open": 3829950,
            "volume": "334.6864",
            "sell": "3840630.0",
            "buy": "3834985.0",
            "at": 1613718210,
            "name": "BTC/INR"
        },
    }

## Bitbns

https://api.bitbns.com/api/trade/v1/tickers (NEED API KEY)

## giottus

https://www.giottus.com/api/v2/ticker

```
{
    "xlmbtc":{
        "sell": "0.00080413",
        "high": "5E-8",
        "buy": "0.00000029",
        "last": "0.00000005",
        "name": "XLM/BTC",
        "base_unit": "xlm",
        "type": "SPOT",
        "volume": "0E-8",
        "quote_unit": "btc",
        "at": 1598952187,
        "open": "5E-8",
        "low": "5E-8"
        },
}
```

## colodax

https://colodax.com/api/ticker

```
{
    "BTC_INR":{
        "pricePrec":2,
        "highestBid":3835657,
        "quote_volume":95404846.9374,"lowestAskVol":0.1041,"base_volume":24.8391,"quantityPrec":4,"highestBidVol":0.1321,"lowestAsk":3851031,"last_price":3840914
    }
}
```

## ZEBPAY

https://www.zebapi.com/pro/v1/market/BTC-INR/ticker

```
{
    "buy": "3822000.01",
    "sell": "3818000.00",
    "market": "3818000",
    "pricechange": "-0.21",
    "volume": 50.68292561,
    "24hoursHigh": "3850000",
    "24hoursLow": "3782000",
    "pair": "BTC-INR",
    "virtualCurrency": "BTC",
    "currency": "INR"
}
```

## COINDCX

https://public.coindcx.com/exchange/ticker

```
[
    {
        "market": "BTCINR",
        "change_24_hour": "0.272",
        "high": "3856736.73",
        "low": "3765345.02",
        "volume": "15408935.9594709",
        "last_price": "3835517.540000",
        "bid": "3826001.62",
        "ask": "3835517.55",
        "timestamp": 1613718453
        },
]
```
