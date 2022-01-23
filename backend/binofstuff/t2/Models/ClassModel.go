package Models

type Class struct {
	code  string  'json:"code"'
	name  string  'json:"name"'
}

func (b *Class)