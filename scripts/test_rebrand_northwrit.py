"""Regression checks for product text rebranding."""

import unittest
from pathlib import Path

from rebrand_northwrit import MARK, replace_brand, transform


class RebrandTests(unittest.TestCase):
    def test_addresses_and_imports_remain_compatible(self) -> None:
        source = 'from onyx.errors import OnyxError\n"Onyx at https://onyx.app"\n'
        self.assertEqual(
            replace_brand(source),
            'from onyx.errors import OnyxError\n"NorthWrit at https://onyx.app"\n',
        )

    def test_copyright_is_preserved(self) -> None:
        source = "Copyright Onyx\nWelcome to Onyx\n"
        self.assertEqual(replace_brand(source), "Copyright Onyx\nWelcome to NorthWrit\n")

    def test_localized_text_and_newlines(self) -> None:
        source = '"message": "Bienvenue sur Onyx — café"\r\n'
        self.assertEqual(
            replace_brand(source), '"message": "Bienvenue sur NorthWrit — café"\r\n'
        )

    def test_marks_are_idempotent(self) -> None:
        source = b'<svg viewBox="0 0 64 64"><path d="old" /></svg>'
        path = Path("web/lib/opal/src/logos/onyx-logo.tsx")
        result = transform(path, source)
        self.assertIn(MARK.encode(), result)
        self.assertEqual(transform(path, result), result)

    def test_binary_is_untouched(self) -> None:
        self.assertEqual(transform(Path("image.svg"), b"Onyx\x00"), b"Onyx\x00")


if __name__ == "__main__":
    unittest.main()
