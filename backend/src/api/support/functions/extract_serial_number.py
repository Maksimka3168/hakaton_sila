import re


def extract_serial_number_fn(text):
    if not isinstance(text, str):
        return 'Нет серийного номера'

    text = text.upper()

    cyrillic_to_latin = {
        ord('А'): 'A', ord('В'): 'B', ord('Е'): 'E', ord('К'): 'K',
        ord('М'): 'M', ord('Н'): 'H', ord('О'): 'O', ord('Р'): 'R',
        ord('С'): 'C', ord('Т'): 'T', ord('У'): 'Y', ord('Х'): 'X',
        ord('Ц'): 'C', ord('Ч'): 'CH', ord('Ш'): 'SH', ord('Щ'): 'SCH',
        ord('Ь'): '', ord('Ы'): 'Y', ord('Ъ'): '', ord('Э'): 'E',
        ord('Ю'): 'YU', ord('Я'): 'YA',

        ord('а'): 'A', ord('в'): 'B', ord('е'): 'E', ord('к'): 'K',
        ord('м'): 'M', ord('н'): 'H', ord('о'): 'O', ord('р'): 'R',
        ord('с'): 'C', ord('т'): 'T', ord('у'): 'Y', ord('х'): 'X',
        ord('ц'): 'C', ord('ч'): 'CH', ord('ш'): 'SH', ord('щ'): 'SCH',
        ord('ь'): '', ord('ы'): 'Y', ord('ъ'): '', ord('э'): 'E',
        ord('ю'): 'YU', ord('я'): 'YA',
    }

    text = text.translate(cyrillic_to_latin)

    pattern = r'\b[A-Z]{1,4}\d{6,}\b'
    matches = re.findall(pattern, text)

    if matches:
        return matches[0]
    else:
        return 'Уточнить'

