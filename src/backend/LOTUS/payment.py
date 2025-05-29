#! /usr/bin/env python3.6
"""
stripe.py
Stripe Sample.
Python 3.6 or newer required.
"""
import os
#from flask import Flask, jsonify, redirect, request
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import stripe



# This is your test secret API key.
stripe.api_key = os.getenv("STRIPE_KEY")


YOUR_DOMAIN = 'http://localhost:8000'
PRICE_ID = 'price_1Qw5US08yxMUUHDIQdhEOyeU'
stripe_router = APIRouter(tags=["Stripe"])



@stripe_router.post("/create-payment-intent/{total}", status_code=201)
def create_payment_intent(total: int):   
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=total,
            currency='usd',
            payment_method_types=['card'],
        )
        client_secret = payment_intent.client_secret;
        return JSONResponse(content={"clientSecret": client_secret})

    
    except:
        return JSONResponse(content={"error": str("Failed to create intent")}, status_code=500)
    


@stripe_router.get('/session-status', status_code=200)
def session_status(session_id: str = None):
    # session_id = request.query_params.get('session_id')
    
    # Validate session_id before proceeding
    if not session_id:
        return JSONResponse(content={"error": "Missing session_id in request"}, status_code=400)
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return JSONResponse(content={
            "status": session.status,
            "customer_email": session.customer_details.email
        })
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

