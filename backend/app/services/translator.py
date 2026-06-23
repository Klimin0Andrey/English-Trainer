from googletrans import Translator
from app.services.dictionary import get_word_data

translator = Translator()


def translate_word(english_word: str) -> tuple[str, str, list[str]]:
    """
    Переводит слово и получает транскрипцию с примерами
    """
    translation = ""
    transcription = ""
    examples = []

    try:
        # Получаем перевод
        result = translator.translate(english_word, src="en", dest="ru")
        translation = result.text

        # Получаем транскрипцию и примеры
        word_data = get_word_data(english_word)
        transcription = word_data.get("transcription", "")
        examples = word_data.get("examples", [])

        # Если транскрипция пустая - пробуем через другой API
        if not transcription:
            transcription = get_transcription_alternative(english_word)

    except Exception as e:
        print(f"Translation error: {e}")
        translation = english_word  # Если перевод не сработал, оставляем английское слово

    return translation, transcription, examples


def get_transcription_alternative(word: str) -> str:
    """
    Альтернативный способ получения транскрипции
    """
    # Можно использовать другой API, например:
    # https://api.voicerss.org/
    # Но пока возвращаем пустую строку
    return ""