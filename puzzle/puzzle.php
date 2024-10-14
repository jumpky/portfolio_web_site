if (isset($_GET['question1']) && isset($_GET['question2'])) {
                    $quest1 = $_GET["question1"];
                    $score = 0;

                    if ($quest1 == "ель" || $quest1 == "елка" || $quest1 == "ёлка") {
                        echo '1 - Правильно';
                        $score++;
                    } else {
                        echo '1 - Не правильно';
                    }

                    echo '<br>';

                    $quest2 = $_GET["question2"];
                    if ($quest2 == "капуста" || $quest2 == "капустка") {
                        echo '2 - Правильно';
                        $score++;
                    } else {
                        echo '2 - Не правильно';
                    }

                    echo '<br><br>';

                    echo 'Вы угадали ' . $score . ' загадок';
                }
