import requests
from typing import Dict, Any
from googletrans import Translator

translator = Translator()


def get_word_data(word: str) -> Dict[str, Any]:
    """
    Получает данные о слове из нескольких источников
    """
    result = {
        "translation": "",
        "transcription": "",
        "examples": []
    }

    # 1. Пробуем получить транскрипцию через dictionaryapi
    try:
        url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
        response = requests.get(url, timeout=5)

        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                word_data = data[0]

                # Транскрипция
                if "phonetics" in word_data:
                    for phonetic in word_data["phonetics"]:
                        if "text" in phonetic and phonetic["text"]:
                            result["transcription"] = phonetic["text"]
                            break

                # Примеры
                if "meanings" in word_data:
                    for meaning in word_data["meanings"]:
                        if "definitions" in meaning:
                            for definition in meaning["definitions"]:
                                if "example" in definition and definition["example"]:
                                    result["examples"].append(definition["example"])
                                if len(result["examples"]) >= 3:
                                    break
                        if len(result["examples"]) >= 3:
                            break
    except Exception as e:
        print(f"Dictionary API error: {e}")

    # 2. Если транскрипции нет, пробуем через другой источник
    if not result["transcription"]:
        try:
            # Используем альтернативный API (например, Wiktionary)
            # Пока просто генерируем фонетическую транскрипцию
            result["transcription"] = generate_fallback_transcription(word)
        except Exception:
            result["transcription"] = ""

    # 3. Если нет примеров, генерируем простые примеры
    if not result["examples"]:
        result["examples"] = generate_fallback_examples(word)

    return result


def generate_fallback_transcription(word: str) -> str:
    """
    Генерирует простую транскрипцию для слова
    (упрощённая версия для демонстрации)
    """
    # База простых транскрипций для частых слов
    common_words = {
        "apple": "/ˈæp.əl/",
        "table": "/ˈteɪ.bəl/",
        "book": "/bʊk/",
        "cat": "/kæt/",
        "dog": "/dɒɡ/",
        "house": "/haʊs/",
        "car": "/kɑːr/",
        "tree": "/triː/",
        "water": "/ˈwɔː.tər/",
        "fire": "/faɪər/"
    }

    if word.lower() in common_words:
        return common_words[word.lower()]

    # Если слова нет в базе, возвращаем пустую строку
    return ""


def generate_fallback_examples(word: str) -> list[str]:
    """
    Генерирует простые примеры для слова
    """
    examples = [
        f"This is a {word}.",
        f"I see a {word}.",
        f"The {word} is here."
    ]
    return examples[:2]  # Возвращаем только 2 примера