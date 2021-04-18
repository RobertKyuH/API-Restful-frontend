import React, { Component } from 'react';

export default class ApiManager{

    constructor(){

    }

    static isAuthorized() {
        if(localStorage.getItem("accessToken")==="null")
            return false;
        else
            return true;
    }
}