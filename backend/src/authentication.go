package src

import (
	"time"

	"github.com/golang-jwt/jwt"
)

//var secret = "secret"

type Claims struct {
	*jwt.StandardClaims
	Username string
}

func CreateJWT(username string) (string, error) {

	claims := jwt.StandardClaims{
		Issuer:    username,
		IssuedAt:  time.Now().Unix(),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}

func ParseJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	//TODO: Handle expired tokens with proper error code
	return token.Claims.(*Claims), nil
}
