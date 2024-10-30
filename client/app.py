# Load model directly
from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("samhitmantrala/hk111")
model = AutoModelForSequenceClassification.from_pretrained("samhitmantrala/hk111")