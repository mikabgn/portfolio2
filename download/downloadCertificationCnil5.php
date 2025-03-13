<?php
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="Certificat_Module5_Cnil.pdf"');
header("Content-Length: " . filesize("Certificat_Module5_Cnil.pdf"));
$fp = fopen("Certificat_Module5_Cnil.pdf", "r");
fpassthru($fp);
fclose($fp);
?>
